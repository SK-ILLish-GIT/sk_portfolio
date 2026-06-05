import {
  profile,
  experience,
  projects,
  skillGroups,
  education,
  certifications,
  achievements,
  contactLinks,
  stations,
} from '../data/portfolio';

/** Fixed HTML panels; the one matching the active station fades in. */
export default function Overlay({ active }: { active: number }) {
  return (
    <div className="overlay">
      {stations.map((s, i) => {
        // Welcome content lives on the 3D gate — no duplicate HTML card.
        if (s.id === 'hero') return null;
        return (
          <div key={s.id} className={`panel ${i === active ? 'is-active' : ''}`} aria-hidden={i !== active}>
            <Panel id={s.id} accent={s.accent} />
          </div>
        );
      })}
    </div>
  );
}

function Eyebrow({ accent, children }: { accent: string; children: string }) {
  return (
    <span className="eyebrow" style={{ background: accent }}>
      {children}
    </span>
  );
}

function Panel({ id, accent }: { id: string; accent: string }) {
  switch (id) {
    case 'hero':
      return (
        <>
          <Eyebrow accent={accent}>Welcome</Eyebrow>
          <h1>{profile.name}</h1>
          <p className="lead">
            {profile.title} — {profile.tagline}
          </p>
        </>
      );

    case 'about':
      return (
        <>
          <Eyebrow accent={accent}>About</Eyebrow>
          <h2>Hi, I'm Sahil 👋</h2>
          <p>{profile.summary}</p>
        </>
      );

    case 'experience':
      return (
        <>
          <Eyebrow accent={accent}>Experience</Eyebrow>
          <h2>Where I've worked</h2>
          <div className="list">
            {experience.map((e) => (
              <div className="card" key={e.company}>
                <div className="row">
                  <span className="title">
                    {e.role} · {e.company}
                  </span>
                  <span className="meta">
                    {e.period} · {e.location}
                  </span>
                </div>
                <div className="stack">{e.stack}</div>
                <ul>
                  {e.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </>
      );

    case 'projects':
      return (
        <>
          <Eyebrow accent={accent}>Projects</Eyebrow>
          <h2>Things I've built</h2>
          <div className="list">
            {projects.map((p) => (
              <div className="card" key={p.name}>
                <div className="row">
                  <span className="title">
                    {p.name} — {p.tagline}
                  </span>
                  <span className="meta">{p.period}</span>
                </div>
                <div className="stack">{p.stack}</div>
                <ul>
                  {p.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
                {p.link && (
                  <a className="chip" href={p.link} target="_blank" rel="noreferrer">
                    Visit ↗
                  </a>
                )}
              </div>
            ))}
          </div>
        </>
      );

    case 'skills':
      return (
        <>
          <Eyebrow accent={accent}>Skills</Eyebrow>
          <h2>My toolkit</h2>
          <div className="list">
            {skillGroups.map((g) => (
              <div className="card" key={g.label}>
                <span className="title">{g.label}</span>
                <div className="chips">
                  {g.items.map((it) => (
                    <span className="chip" key={it}>
                      {it}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      );

    case 'education':
      return (
        <>
          <Eyebrow accent={accent}>Education</Eyebrow>
          <h2>{education.institution}</h2>
          <div className="card">
            <div className="row">
              <span className="title">{education.degree}</span>
              <span className="meta">{education.period}</span>
            </div>
            <div className="stack">Marks: {education.marks}</div>
          </div>
        </>
      );

    case 'certifications':
      return (
        <>
          <Eyebrow accent={accent}>Certifications & Achievements</Eyebrow>
          <h2>Credentials & competitive coding</h2>
          <div className="card">
            <span className="title">Certifications</span>
            <ul>
              {certifications.map((c, i) => (
                <li key={i}>{c.text}</li>
              ))}
            </ul>
          </div>
          <div className="card">
            <span className="title">Competitive Programming</span>
            <ul>
              {achievements.map((a, i) => (
                <li key={i}>
                  <strong>{a.platform}:</strong> {a.detail}
                </li>
              ))}
            </ul>
          </div>
        </>
      );

    case 'contact':
      return (
        <>
          <Eyebrow accent={accent}>Contact</Eyebrow>
          <h2>Let's build something</h2>
          <p>Reach out — I'm always happy to chat about engineering, observability, or new opportunities.</p>
          <div className="contact-links">
            {contactLinks.map((l) => (
              <a key={l.label} href={l.href} target="_blank" rel="noreferrer">
                <div className="k">{l.label}</div>
                <div className="v">{l.value}</div>
              </a>
            ))}
          </div>
        </>
      );

    default:
      return null;
  }
}
