import type { StationId } from '../../data/portfolio';
import type { Phase } from '../../config/intro';
import HeroProps from './HeroProps';
import AboutProps from './AboutProps';
import ExperienceProps from './ExperienceProps';
import ProjectsProps from './ProjectsProps';
import SkillsProps from './SkillsProps';
import EducationProps from './EducationProps';
import CertificationsProps from './CertificationsProps';
import ContactProps from './ContactProps';

/**
 * Picks the procedural 3D props for a station. Each prop component renders only
 * the objects that sit on its island; textual content lives in the HTML overlay
 * (except the hero gate, whose name is baked into the 3D sign).
 */
export default function StationProps({ id, accent, phase = 'live' }: { id: StationId; accent: string; phase?: Phase }) {
  switch (id) {
    case 'hero':
      return <HeroProps accent={accent} phase={phase} />;
    case 'about':
      return <AboutProps accent={accent} />;
    case 'experience':
      return <ExperienceProps accent={accent} />;
    case 'projects':
      return <ProjectsProps accent={accent} />;
    case 'skills':
      return <SkillsProps accent={accent} />;
    case 'education':
      return <EducationProps accent={accent} />;
    case 'certifications':
      return <CertificationsProps accent={accent} />;
    case 'contact':
      return <ContactProps accent={accent} />;
    default:
      return null;
  }
}
