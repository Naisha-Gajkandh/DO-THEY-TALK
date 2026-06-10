import json

def median(lst):
    if not lst:
        return 0.0
    sorted_lst = sorted(lst)
    n = len(sorted_lst)
    mid = n // 2
    if n % 2 != 0:
        return float(sorted_lst[mid])
    else:
        return float(sorted_lst[mid - 1] + sorted_lst[mid]) / 2.0

def clamp_outliers(data):
    if len(data) < 5:
        return data
    values = [float(d['value']) for d in data]
    med = median(values)
    deviations = [abs(v - med) for v in values]
    mad = median(deviations)
    if mad == 0.0:
        mad = 1.0
    limit = mad * 6.0
    
    clamped_data = []
    for d in data:
        v = float(d['value'])
        clamped_val = max(med - limit, min(med + limit, v))
        clamped_data.append({'year': int(d['year']), 'value': clamped_val})
    return clamped_data

def clean_series(data):
    by_year = {}
    for point in data:
        try:
            year = int(point.get('year'))
            value = float(point.get('value'))
        except (ValueError, TypeError, KeyError):
            continue
        if year < 1900 or year > 2100:
            continue
        if year not in by_year:
            by_year[year] = []
        by_year[year].append(value)
        
    averaged = []
    for year, values in by_year.items():
        averaged.append({
            'year': year,
            'value': sum(values) / len(values)
        })
    averaged.sort(key=lambda d: d['year'])
    return clamp_outliers(averaged)

def interpolate_missing(data, start_year, end_year):
    if not data:
        return []
    val_map = {d['year']: d['value'] for d in data}
    result = []
    
    for y in range(start_year, end_year + 1):
        if y in val_map:
            result.append({'year': y, 'value': val_map[y]})
        else:
            # Find nearest before and after
            before = [d for d in data if d['year'] < y]
            after = [d for d in data if d['year'] > y]
            if before and after:
                b = before[-1]
                a = after[0]
                ratio = (y - b['year']) / (a['year'] - b['year'])
                interpolated = b['value'] + ratio * (a['value'] - b['value'])
                result.append({'year': y, 'value': round(interpolated, 2)})
    return result

def align_and_impute(data_a, data_b):
    clean_a = clean_series(data_a)
    clean_b = clean_series(data_b)
    if not clean_a or not clean_b:
        return [], [], []
    
    start_year = max(clean_a[0]['year'], clean_b[0]['year'])
    end_year = min(clean_a[-1]['year'], clean_b[-1]['year'])
    if end_year < start_year:
        return [], [], []
        
    filled_a = interpolate_missing(clean_a, start_year, end_year)
    filled_b = interpolate_missing(clean_b, start_year, end_year)
    
    map_a = {d['year']: d['value'] for d in filled_a}
    map_b = {d['year']: d['value'] for d in filled_b}
    
    years = sorted([y for y in map_a if y in map_b])
    
    return years, [map_a[y] for y in years], [map_b[y] for y in years]

def normalize(values):
    if not values:
        return []
    avg = sum(values) / len(values)
    variance = sum((v - avg) ** 2 for v in values) / len(values)
    std = variance ** 0.5 or 1.0
    return [(v - avg) / std for v in values]

def pearson_correlation(x, y):
    n = len(x)
    if n < 2:
        return 0.0
    mean_x = sum(x) / n
    mean_y = sum(y) / n
    
    num = sum((x[i] - mean_x) * (y[i] - mean_y) for i in range(n))
    den_x = sum((x[i] - mean_x) ** 2 for i in range(n))
    den_y = sum((y[i] - mean_y) ** 2 for i in range(n))
    
    if den_x == 0.0 or den_y == 0.0:
        return 0.0
    return num / ((den_x * den_y) ** 0.5)

def score_correlation(data_a, data_b, min_correlation=0.87):
    years, values_a, values_b = align_and_impute(data_a, data_b)
    
    if len(years) < 6:
        return {
            'years': years,
            'valuesA': values_a,
            'valuesB': values_b,
            'r': 0.0,
            'rSquared': 0.0,
            'absR': 0.0,
            'passesThreshold': False,
            'confidence': 0.0,
            'reason': 'Not enough overlapping annual data after cleaning.'
        }
        
    r = pearson_correlation(values_a, values_b)
    abs_r = abs(r)
    overlap_confidence = min(1.0, len(years) / 12.0)
    threshold_margin = max(0.0, (abs_r - min_correlation) / (1.0 - min_correlation))
    
    confidence = round((0.65 * overlap_confidence + 0.35 * threshold_margin) * 100.0) / 100.0
    passes_threshold = abs_r >= min_correlation
    
    reason = (
        'The cleaned annual series passes the display threshold.'
        if passes_threshold else
        f'The cleaned annual series is below the r >= {min_correlation:.2f} display threshold.'
    )
    
    return {
        'years': years,
        'valuesA': values_a,
        'valuesB': values_b,
        'r': r,
        'rSquared': r * r,
        'absR': abs_r,
        'passesThreshold': passes_threshold,
        'confidence': confidence,
        'reason': reason
    }

def discover_correlations(left_id, left_data, right_datasets, min_correlation=0.87, limit=48):
    """
    Computes correlations between a base dataset (left_data) and a list of candidates.
    right_datasets format: [{'id': id, 'name': name, 'data': [{'year': y, 'value': v}, ...]}]
    """
    results = []
    for right in right_datasets:
        r_id = right['id']
        r_name = right['name']
        r_data = right['data']
        if r_id == left_id:
            continue
        
        score = score_correlation(left_data, r_data, min_correlation)
        if score['passesThreshold']:
            results.append({
                'a': left_id,
                'b': r_id,
                'title': f"{right['name']} vs (Left)", # Handled in JS for formatting
                'r': score['r'],
                'absR': score['absR'],
                'dataPoints': len(score['years'])
            })
            
    # Rank them
    results.sort(key=lambda x: (-x['absR'], -x['dataPoints']))
    return results[:limit]

# JSON Wrappers for JS invocation via Pyodide
def score_correlation_js(data_a_json, data_b_json, min_correlation=0.87):
    try:
        data_a = json.loads(data_a_json)
        data_b = json.loads(data_b_json)
        res = score_correlation(data_a, data_b, float(min_correlation))
        return json.dumps({'success': True, 'result': res})
    except Exception as e:
        return json.dumps({'success': False, 'error': str(e)})

def discover_correlations_js(left_id, left_data_json, right_datasets_json, min_correlation=0.87, limit=48):
    try:
        left_data = json.loads(left_data_json)
        right_datasets = json.loads(right_datasets_json)
        res = discover_correlations(left_id, left_data, right_datasets, float(min_correlation), int(limit))
        return json.dumps({'success': True, 'results': res})
    except Exception as e:
        return json.dumps({'success': False, 'error': str(e)})

def deterministic_pick(options, seed_text):
    if not options:
        return ''
    seed = sum((idx + 1) * ord(ch) for idx, ch in enumerate(seed_text))
    return options[seed % len(options)]

def generate_explanation_payload(name_a, name_b, r_percent):
    seed = f'{name_a}|{name_b}|{r_percent}'
    institutes = [
        'Institute for Implausible Measurement',
        'Laboratory of Coincidental Systems',
        'Bureau of Statistical Mirage Control',
        'Center for Anomaly Storytelling',
    ]
    mechanisms = [
        'a shared sensitivity to calendar drift',
        'a hidden dependency on public attention cycles',
        'an accidental resonance in annual reporting intervals',
        'a suspicious alignment of unrelated measurement habits',
        'the universal human talent for seeing patterns in noise',
    ]
    verbs = [
        'appears to shadow',
        'moves in cinematic lockstep with',
        'echoes',
        'performs an unlikely statistical duet with',
    ]
    warnings = [
        'The relationship is visually persuasive, but it is not causal evidence.',
        'The model sees synchronized motion, not a mechanism.',
        'The signal is strong enough to display and strange enough to doubt.',
        'Treat this as a coincidence engine, not a prophecy machine.',
    ]

    institute = deterministic_pick(institutes, seed)
    mechanism = deterministic_pick(mechanisms, seed + 'mechanism')
    verb = deterministic_pick(verbs, seed + 'verb')
    warning = deterministic_pick(warnings, seed + 'warning')

    headline = f'{name_a} {verb} {name_b} at {r_percent}% correlation'
    explanation = (
        f'{institute} flags the pair because {name_a} and {name_b} share '
        f'{mechanism}. That sounds meaningful until the control room remembers '
        'that correlation can be a very convincing costume.'
    )
    observations = [
        f'The cleaned and interpolated annual series cross the display threshold at {r_percent}%.',
        warning,
        'The confidence score rewards overlap length and distance above the threshold, not real-world causality.',
    ]

    return {
        'headline': headline,
        'explanation': explanation,
        'observations': observations,
    }

def generate_explanation_payload_js(name_a, name_b, r_percent):
    try:
        res = generate_explanation_payload(str(name_a), str(name_b), str(r_percent))
        return json.dumps({'success': True, 'result': res})
    except Exception as e:
        return json.dumps({'success': False, 'error': str(e)})

# Evaluator for debugging
def evaluate_expression_js(expr, globals_dict_json=None):
    try:
        # Simple eval function for user debugging console
        res = eval(expr)
        return json.dumps({'success': True, 'result': str(res)})
    except Exception as e:
        return json.dumps({'success': False, 'error': str(e)})

if __name__ == '__main__':
    # Local unit tests
    print("Running Python statistical tests...")
    test_a = [{'year': 2000, 'value': 10}, {'year': 2001, 'value': 20}, {'year': 2002, 'value': 30}]
    test_b = [{'year': 2000, 'value': 20}, {'year': 2001, 'value': 40}, {'year': 2002, 'value': 60}]
    
    # Check median
    assert median([1, 3, 2]) == 2.0
    assert median([1, 4, 3, 2]) == 2.5
    
    # Check pearson
    assert pearson_correlation([1, 2, 3], [2, 4, 6]) == 1.0
    assert pearson_correlation([1, 2, 3], [-2, -4, -6]) == -1.0
    
    # Clean and interpolate
    data_with_gap = [{'year': 2000, 'value': 10}, {'year': 2002, 'value': 30}]
    interpolated = interpolate_missing(data_with_gap, 2000, 2002)
    assert len(interpolated) == 3
    assert interpolated[1]['value'] == 20.0
    
    print("All tests passed successfully!")
