import React from 'react';
import { motion } from 'framer-motion';
import Icon from './Icon';
import logoImg from '../logo.png';

const socialLinks = [
  { label: 'GitHub', href: 'https://github.com/Naisha-Gajkandh' },
  { label: 'Email', href: 'mailto:naishagajkandh@gamil.com' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/naisha-gajkandh-28b44a312/' },
];

function Section({ title, children }) {
  return (
    <section className="space-y-3">
      <h2 className="font-display font-bold text-xl md:text-2xl" style={{ color: 'var(--text-primary)' }}>
        {title}
      </h2>
      <div className="space-y-3">
        {children}
      </div>
    </section>
  );
}

function ProjectAbout() {
  return (
    <>
      <h1 className="font-display font-bold text-3xl md:text-4xl mb-8" style={{ color: 'var(--text-primary)' }}>
        About This Project
      </h1>

      <div className="space-y-6 text-base md:text-lg leading-7 md:leading-8 font-light" style={{ color: 'var(--text-secondary)' }}>
        <p>
          As someone fascinated by data and patterns, I have always wondered about something strange:
        </p>

        <p className="font-medium text-xl" style={{ color: 'var(--accent)' }}>
          Can mathematics prove absolutely anything if we search hard enough for patterns? Or does it prove useless things?
        </p>

        <p>
          In a world overflowing with numbers, trends, and statistics, unrelated things sometimes
          move together so perfectly that they almost feel connected. Shark attacks rise with ice
          cream sales. Cheese consumption mirrors bizarre accidents. Movie releases seem to
          predict completely unrelated events.
        </p>

        <p>
          Most of these relationships are meaningless coincidences. But some discoveries in
          history also began as strange observations people almost ignored.
        </p>

        <p>
          This project was created to explore that thin line between coincidence and curiosity.
        </p>

        <div className="p-5 md:p-6 rounded-lg my-8" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
          <p className="italic">
            "Spurious Correlations" is not just a collection of funny graphs - it is a reminder
            that humans naturally search for meaning in patterns. Sometimes we are completely
            wrong. Sometimes we discover something real. And sometimes, the universe surprises us
            in ways logic alone cannot explain.
          </p>
        </div>

        <p>
          Many inventions, theories, and breakthroughs were born because someone doubted what
          others ignored.
        </p>

        <p>
          This website invites you to explore those strange connections: not to blindly believe
          them, but to question them, laugh at them, and maybe wonder a little deeper about how
          patterns shape the way we see the world.
        </p>

        <p className="font-medium pt-4">
          Because not every correlation means causation...
          <br />
          <span style={{ color: 'var(--accent)' }}>
            but every curiosity begins with noticing something unusual.
          </span>
        </p>
      </div>
    </>
  );
}

function AboutLogo() {
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
        <img
          src={logoImg}
          alt="DO THEY TALK logo"
          className="w-32 h-32 md:w-40 md:h-40 object-contain shrink-0"
        />
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.16em] mb-3" style={{ color: 'var(--accent)' }}>
            DO THEY TALK
          </p>
          <h1 className="font-display font-bold text-3xl md:text-4xl" style={{ color: 'var(--text-primary)' }}>
            About the Logo
          </h1>
        </div>
      </div>

      <div className="space-y-8 text-base md:text-lg leading-7 md:leading-8 font-light" style={{ color: 'var(--text-secondary)' }}>
        <Section title="Two Things That Should Never Meet - But Do">
          <p>The logo is simple. Two shapes, facing each other. A signal between them.</p>
          <p>But look again - these two shapes have nothing in common.</p>
          <p>
            One is round. One is angular. Different by nature, different by design, built for
            entirely different purposes. In any logical world, they would never be in the same
            room, let alone the same conversation.
          </p>
          <p className="font-medium" style={{ color: 'var(--accent)' }}>And yet - there is a pulse between them.</p>
        </Section>

        <Section title="The Shapes Are the Data">
          <p>Every correlation on this website looks exactly like this logo.</p>
          <p>
            Ice cream sales and shark attacks. Nicolas Cage films and pool drownings. Two
            completely unrelated things, sitting across from each other - and somehow,
            impossibly, speaking the same frequency.
          </p>
          <p>
            That light blue waveform between the two shapes? That is the correlation. That is
            the moment the data says something nobody asked it to say.
          </p>
          <p>Nobody designed it. Nobody planned it. It just... appeared.</p>
        </Section>

        <Section title="Why That Matters More Than You Think">
          <p>Penicillin was an accident. Velcro was an accident. X-rays were an accident.</p>
          <p>
            The history of human invention is full of people who noticed something they were not
            supposed to notice - two things talking that had no business talking - and instead of
            walking away, they asked why.
          </p>
          <p>DO THEY TALK exists for that exact moment of curiosity.</p>
          <p>
            We are not here to prove these correlations mean something. We are here to make you
            wonder if they do. Because wondering is where everything begins.
          </p>
        </Section>

        <Section title="The Circle">
          <p>The circle around the two shapes is not random.</p>
          <p>
            It is the boundary of one universe - one dataset, one world, one moment in time -
            where two unrelated things were measured together and surprised everyone.
          </p>
          <p>Every graph on this website is its own circle. Its own impossible conversation.</p>
          <p className="font-medium" style={{ color: 'var(--accent)' }}>Step inside. See what the data is trying to tell you.</p>
        </Section>

        <Section title="About the Name">
          <p className="font-medium text-xl" style={{ color: 'var(--accent)' }}>Do they talk?</p>
          <p>
            It is the question a statistician would never ask. It is the question a scientist
            asks right before they change everything.
          </p>
          <p>Two things that do not relate - do they talk?</p>
          <p>
            Sometimes the answer is noise. Sometimes the answer is the beginning of something
            the world has never seen.
          </p>
          <p>You will not know until you look.</p>
        </Section>
      </div>
    </>
  );
}

function AboutMe() {
  return (
    <>
      <p className="font-mono text-xs uppercase tracking-[0.16em] mb-3" style={{ color: 'var(--accent)' }}>
        Naisha Gajkandh
      </p>
      <h1 className="font-display font-bold text-3xl md:text-4xl mb-4" style={{ color: 'var(--text-primary)' }}>
        The Person Behind the Patterns
      </h1>
      <p className="text-lg md:text-xl font-medium mb-8" style={{ color: 'var(--text-secondary)' }}>
        Data Science & ML Engineer - in the making.
      </p>

      <div className="space-y-8 text-base md:text-lg leading-7 md:leading-8 font-light" style={{ color: 'var(--text-secondary)' }}>
        <Section title="What Drives me">
          <p>
            The art of coincidence. The art of patterns that were never drawn. The universe
            connecting things that have no business being connected - so precisely, so
            repeatedly, that you cannot look away.
          </p>
          <p>
            I believe the most important discoveries in history did not begin with certainty.
            They began with someone standing in front of something strange and choosing not to
            walk away.
          </p>
          <p className="font-medium" style={{ color: 'var(--accent)' }}>
            That is the only path I have ever known how to take.
          </p>
        </Section>

        <Section title="Links">
          <div className="flex flex-wrap gap-3">
            {socialLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target={link.href.startsWith('mailto:') ? undefined : '_blank'}
                rel={link.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                className="btn-ghost px-4 py-2 text-sm transition-colors hover:text-[var(--accent)]"
              >
                {link.label}
              </a>
            ))}
          </div>
        </Section>
      </div>
    </>
  );
}

export default function About({ onBack }) {
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 pb-16">
      <button
        onClick={onBack}
        className="flex items-center gap-2 mb-8 text-sm font-medium transition-colors hover:text-[var(--accent)] cursor-pointer"
        style={{ color: 'var(--text-muted)' }}
      >
        <Icon name="arrow-left" size={16} />
        Back
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card p-7 md:p-10"
      >
        <div className="space-y-12">
          <ProjectAbout />
          <div className="h-px" style={{ background: 'var(--border)' }} />
          <AboutLogo />
          <div className="h-px" style={{ background: 'var(--border)' }} />
          <AboutMe />
        </div>
      </motion.div>
    </div>
  );
}
