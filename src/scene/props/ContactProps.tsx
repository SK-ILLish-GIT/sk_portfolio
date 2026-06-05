import { GlowingOrb, Mailbox } from '../components';

/** A mailbox with a floating message orb on the Contact island. */
export default function ContactProps({ accent }: { accent: string }) {
  return (
    <group>
      <Mailbox accent={accent} />
      <GlowingOrb accent={accent} y={3} floating />
    </group>
  );
}
