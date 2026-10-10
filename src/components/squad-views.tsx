import { rosterFor, type SquadConfig, type Team } from "@/data/squads";
import { sportLabel } from "@/lib/site";
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

export function SquadView({ config, team }: { config: SquadConfig; team: Team }) {
  const label = sportLabel(config.sport)?.toLowerCase();
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            India {team === "women" ? "women's" : "men's"} {label} squad
          </h1>
          <p className="text-muted-foreground">
            Filter by {config.roleNoun}. Tap a player for their profile.
            {config.asOf && ` Caps and goals as of ${config.asOf}.`}
          </p>
        </div>
        <TeamSwitch base={`/${config.sport}/players`} team={team} />
      </header>
      <PlayersList players={rosterFor(config.sport, team)} roles={config.roles} />
    </div>
  );
}

export function XIView({ config, team }: { config: SquadConfig; team: Team }) {
  const label = sportLabel(config.sport) ?? config.sport;
  // Cricket keeps its original image titles and file names.
  const cricket = config.sport === "cricket";
  const title = cricket
    ? team === "women"
      ? "My India Women Playing XI"
      : "My India Playing XI"
    : `My India ${team === "women" ? "Women " : ""}${label} ${config.xiLabel}`;
  const fileName = cricket
    ? team === "women"
      ? "my-india-women-xi.png"
      : "my-india-xi.png"
    : `my-india-${team === "women" ? "women-" : ""}${config.sport}-xi.png`;

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            {team === "women" ? "Women's" : "Men's"} {config.xiLabel}
          </h1>
          <p className="text-muted-foreground">{config.xiHint} Each team&rsquo;s XI is saved on this device.</p>
        </div>
        <TeamSwitch base={`/${config.sport}/xi`} team={team} />
      </header>
      <XIBuilder
        players={rosterFor(config.sport, team)}
        rules={config.xiRules}
        storageKey={config.storageKey[team]}
        title={title}
        fileName={fileName}
      />
    </div>
  );
}
