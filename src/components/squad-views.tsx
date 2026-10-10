import { squad, type Team } from "@/data/players";
import { PillNav } from "@/components/layout/pill-nav";
import { PlayersList } from "@/components/PlayersList";
import { XIBuilder } from "@/components/XIBuilder";

/** Men / Women switch. Each team is its own static page, so both are linkable and indexable. */
function TeamSwitch({ base, team }: { base: string; team: Team }) {
  return (
    <PillNav
      variant="chips"
      active={team === "women" ? `${base}/women` : base}
      items={[
        { href: base, label: "Men" },
        { href: `${base}/women`, label: "Women" },
      ]}
    />
  );
}

export function SquadView({ sport, team }: { sport: string; team: Team }) {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">{team === "women" ? "India women's squad" : "India men's squad"}</h1>
          <p className="text-muted-foreground">Filter by role. Tap a player for their profile.</p>
        </div>
        <TeamSwitch base={`/${sport}/players`} team={team} />
      </header>
      <PlayersList players={squad(team)} />
    </div>
  );
}

export function XIView({ sport, team }: { sport: string; team: Team }) {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">{team === "women" ? "Women's Playing XI" : "Men's Playing XI"}</h1>
          <p className="text-muted-foreground">
            Pick exactly 11 with at least one wicketkeeper. Each team&rsquo;s XI is saved on this device.
          </p>
        </div>
        <TeamSwitch base={`/${sport}/xi`} team={team} />
      </header>
      <XIBuilder team={team} />
    </div>
  );
}
