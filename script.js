const { useState, useRef, useEffect } = React;
const { createRoot } = ReactDOM;

function Icon({ name, size = "w-5 h-5", className = "" }) {
  const ref = useRef();

  useEffect(() => {
    if (ref.current) {
      lucide.createIcons({
        icons: { [name]: ref.current },
      });
    }
  }, [name]);

  return <i ref={ref} data-lucide={name} className={`${size} ${className}`} />;
}

function SearchBar({ onSearch, searchInputRef }) {
  return (
    <div className="relative flex-1 max-w-md">
      <Icon
        name="search"
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
      />
      <input
        ref={searchInputRef}
        type="text"
        placeholder="Search commands..."
        className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus-visible:ring-2 focus-visible:ring-blue-500/50 transition-all"
        onChange={e => onSearch(e.target.value)}
        spellCheck="false"
        autoComplete="off"
        autoCorrect="off"
      />
    </div>
  );
}

function HavenDocs() {
  const [selectedFeature, setSelectedFeature] = useState("teams");
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef();

  const features = {
    teams: {
      icon: <Icon name="users-round" />,
      title: "Team Management",
      description:
        "Create and manage moderation teams with dedicated team leads.",
      commands: [
        {
          name: "/team create",
          desc: "Create a new team with a designated team lead",
        },
        { name: "/team announce", desc: "Make an announcement to your team" },
        { name: "/team edit name", desc: "Change a team's name" },
        { name: "/team edit team_lead", desc: "Assign a new team lead" },
        { name: "/teamswap", desc: "Move staff between teams" },
        { name: "/teamdashboard init", desc: "Initialize the team dashboard" },
      ],
      color: "from-blue-500/10 to-blue-500/5",
    },
    moderation: {
      icon: <Icon name="shield-check" />,
      title: "Moderation Tools",
      description:
        "Comprehensive tools for managing staff and enforcing rules.",
      commands: [
        { name: "/strike add", desc: "Issue a strike to a staff member" },
        { name: "/strike remove", desc: "Remove an active strike" },
        { name: "/strike view", desc: "View a staff member's strikes" },
        { name: "/blacklist add", desc: "Add a user to the blacklist" },
        { name: "/blacklist view", desc: "View blacklist entries" },
      ],
      color: "from-red-500/10 to-red-500/5",
    },
    staff: {
      icon: <Icon name="award" />,
      title: "Staff Management",
      description: "Enroll and manage staff members with various ranks.",
      commands: [
        { name: "/enroll", desc: "Add new staff members to the system" },
        { name: "/fire", desc: "Remove staff members from the system" },
        { name: "/profile", desc: "View staff member profiles" },
        { name: "/pay check", desc: "Check your monthly compensation" },
      ],
      color: "from-purple-500/10 to-purple-500/5",
    },
    tracking: {
      icon: <Icon name="bar-chart-3" />,
      title: "Activity Tracking",
      description: "Monitor and analyze staff performance and activity.",
      commands: [
        { name: "/statistics", desc: "View department-wide statistics" },
        { name: "Auto Modcall", desc: "Automatic tracking of modcall claims" },
        { name: "/cooldown", desc: "Check rank change cooldowns" },
      ],
      color: "from-green-500/10 to-green-500/5",
    },
    utility: {
      icon: <Icon name="tools" />,
      title: "Utility Features",
      description: "Additional tools and features for staff use.",
      commands: [
        { name: "/request", desc: "Submit rank change requests" },
        { name: "/pride", desc: "Display pride flags" },
        { name: "/bot-info", desc: "View bot information" },
        { name: "/help", desc: "Displays a useful help command" },
      ],
      color: "from-orange-500/10 to-orange-500/5",
    },
  };

  const FeatureCard = ({ id, data, isSelected }) => {
    const bgColor = isSelected ? "bg-white" : "bg-white/5 hover:bg-white/10";
    const textColor = isSelected ? "text-gray-900" : "text-white";

    return (
      <div
        className={`relative overflow-hidden rounded-xl backdrop-blur-sm cursor-pointer transition-all border border-white/10 ${bgColor} ${textColor}`}
        onClick={() => setSelectedFeature(id)}
      >
        <div
          className={`absolute inset-0 bg-gradient-to-br ${data.color} transition-opacity ${isSelected ? "opacity-100" : "opacity-0"}`}
        />
        <div className="relative p-4">
          <div className="flex items-center gap-3 mb-3">
            {data.icon}
            <h3 className="font-bold">{data.title}</h3>
          </div>
          <p
            className={`text-sm ${isSelected ? "text-gray-600" : "text-gray-400"}`}
          >
            {data.description}
          </p>
        </div>
      </div>
    );
  };

  const CommandBlock = ({ command }) => (
    <div className="group relative overflow-hidden rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <code className="font-mono text-blue-400">{command.name}</code>
          <p className="mt-1 text-sm text-gray-400">{command.desc}</p>
        </div>
        <button
          onClick={() => navigator.clipboard.writeText(command.name)}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-white/10 rounded-lg"
          title="Copy command"
        >
          <Icon name="clipboard" size="w-4 h-4" className="text-gray-400" />
        </button>
      </div>
    </div>
  );

  const filteredCommands = features[selectedFeature].commands.filter(
    cmd =>
      cmd.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cmd.desc.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">HavenModeration</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            This bot helps with tasks in the mod team. Select a
            category below to explore available features and commands.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {Object.entries(features).map(([id, data]) => (
            <FeatureCard
              key={id}
              id={id}
              data={data}
              isSelected={selectedFeature === id}
            />
          ))}
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold">Available Commands</h2>
            <SearchBar
              onSearch={setSearchQuery}
              searchInputRef={searchInputRef}
            />
          </div>

          <div className="grid gap-4">
            {filteredCommands.map((cmd, i) => (
              <CommandBlock key={i} command={cmd} />
            ))}
            {filteredCommands.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <Icon name="search-x" className="mx-auto mb-3" />
                <p>No commands match your search</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const root = createRoot(document.getElementById("root"));
root.render(<HavenDocs />);
