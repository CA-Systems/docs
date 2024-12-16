const { useState, useRef, useEffect } = React;
const { createRoot } = ReactDOM;

function Icon({ name, ...props }) {
   const ref = useRef();
   
   useEffect(() => {
       if (ref.current) {
           lucide.createIcons({
               icons: {
                   [name]: ref.current
               }
           });
       }
   }, [name]);

   return <i ref={ref} data-lucide={name} {...props}></i>;
}

function DemoInterface() {
   const [selectedFeature, setSelectedFeature] = useState('teams');

   const features = {
       teams: {
           icon: <Icon name="users" />,
           title: "Team Management",
           description: "Create and manage moderation teams with dedicated team leads.",
           commands: [
               { name: "/team create", desc: "Create a new team with a designated team lead" },
               { name: "/team edit name", desc: "Change a team's name" },
               { name: "/team edit team_lead", desc: "Assign a new team lead" },
               { name: "/teamswap", desc: "Move staff between teams" },
               { name: "/teamdashboard init", desc: "Initialize the team dashboard" }
           ]
       },
       moderation: {
           icon: <Icon name="shield" />,
           title: "Moderation Tools",
           description: "Comprehensive tools for managing staff and enforcing rules.",
           commands: [
               { name: "/strike add", desc: "Issue a strike to a staff member" },
               { name: "/strike remove", desc: "Remove an active strike" },
               { name: "/strike view", desc: "View a staff member's strikes" },
               { name: "/blacklist add", desc: "Add a user to the blacklist" },
               { name: "/blacklist view", desc: "View blacklist entries" }
           ]
       },
       staff: {
           icon: <Icon name="award" />,
           title: "Staff Management",
           description: "Enroll and manage staff members with various ranks.",
           commands: [
               { name: "/enroll", desc: "Add new staff members to the system" },
               { name: "/fire", desc: "Remove staff members from the system" },
               { name: "/profile", desc: "View staff member profiles" },
               { name: "/pay check", desc: "Check your monthly compensation" }
           ]
       },
       tracking: {
           icon: <Icon name="target" />,
           title: "Activity Tracking",
           description: "Monitor and analyze staff performance and activity.",
           commands: [
               { name: "/statistics", desc: "View department-wide statistics" },
               { name: "Auto Modcall", desc: "Automatic tracking of modcall claims" },
               { name: "/cooldown", desc: "Check rank change cooldowns" }
           ]
       },
       utility: {
           icon: <Icon name="brain" />,
           title: "Utility Features",
           description: "Additional tools and features for staff use.",
           commands: [
               { name: "/request", desc: "Submit rank change requests" },
               { name: "/pride", desc: "Display pride flags" },
               { name: "/bot-info", desc: "View bot information" }
           ]
       }
   };

   const FeatureCard = ({ id, data, isSelected }) => (
       <div 
           className={`p-4 rounded-lg cursor-pointer transition-all ${
               isSelected ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
           }`}
           onClick={() => setSelectedFeature(id)}
       >
           <div className="flex items-center gap-2 mb-2">
               {data.icon}
               <h3 className="font-bold">{data.title}</h3>
           </div>
           <p className="text-sm">{data.description}</p>
       </div>
   );

   const CommandList = ({ commands }) => (
       <div className="mt-4">
           <h4 className="font-bold mb-2">Available Commands:</h4>
           <div className="space-y-2">
               {commands.map((cmd, i) => (
                   <div key={i} className="bg-gray-100 p-3 rounded">
                       <code className="font-bold text-blue-600">{cmd.name}</code>
                       <p className="text-sm text-gray-600 mt-1">{cmd.desc}</p>
                   </div>
               ))}
           </div>
       </div>
   );

   return (
       <div className="max-w-4xl mx-auto p-6 space-y-6 bg-white rounded-lg">
           <div className="text-center mb-8">
               <h2 className="text-2xl font-bold mb-2">HavenModeration Features</h2>
               <p className="text-gray-600">Select a category to learn more about available features and commands</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {Object.entries(features).map(([id, data]) => (
                   <FeatureCard 
                       key={id} 
                       id={id} 
                       data={data} 
                       isSelected={selectedFeature === id} 
                   />
               ))}
           </div>

           <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200">
               <div className="flex items-center gap-3 mb-4">
                   {features[selectedFeature].icon}
                   <h3 className="text-xl font-bold">{features[selectedFeature].title}</h3>
               </div>
               <p className="text-gray-600 mb-4">{features[selectedFeature].description}</p>
               <CommandList commands={features[selectedFeature].commands} />
           </div>
       </div>
   );
}

const root = createRoot(document.getElementById('root'));
root.render(<DemoInterface />);
