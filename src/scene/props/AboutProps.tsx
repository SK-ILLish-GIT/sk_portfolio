import { BlockCharacter } from '../components';

/** A cute blocky low-poly character standing on the About island. */
export default function AboutProps({ accent }: { accent: string }) {
  return <BlockCharacter accent={accent} y={0.1} />;
}
