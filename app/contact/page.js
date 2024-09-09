import AppBar from "@/components/AppBar";

const teamMembers = [
    {
      name: 'Jonathan Ballona Sanchez',
      tags: ['Full Stack Developer', 'Project Manager'],
      description: 'University of California, Merced',
      website: 'https://jonathanballonasanchez.com/',
      imgUrl: "https://media.licdn.com/dms/image/v2/D5603AQH075CKMqquGQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1707858516664?e=1729728000&v=beta&t=pCTfvE-Aj-CD0BKnH0hdSOO6CVGz0yLwgfWRenwA7hA",
    },
    {
      name: 'Karla Zamora',
      tags: ['AI/ML', 'Backend Developer'],
      description: 'University of Texas, Rio Grande Valley',
      website: 'https://karla-zamora.com/',
      imgUrl: 'https://media.licdn.com/dms/image/v2/D5603AQFlLt2GhSDanw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1720386285605?e=1729728000&v=beta&t=vnd8n2GkMD2X3mHc7fUQ2vcmfJT4BH3jphfSN0rXOpc',
    },
    {
      name: 'Pranav Palle',
      tags: ['UI/UX Designer', 'Frontend Developer'],
      description: 'University of Maryland, College Park',
      website: 'https://pranavpalle.netlify.app',
      imgUrl: 'https://media.licdn.com/dms/image/v2/D5603AQEeBxxRkZL8Uw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1695523201341?e=1729728000&v=beta&t=6dL2Hpz-LRMAyeOr9q82Q5t3p7cN8io4m8_ttSGBJlw',
    },
  ];

export default function contact() {
    return (
        <div className="main-pg h-screen w-full flex flex-col">
            <AppBar />
            <p className="flex items-center justify-center font-bold text-6xl text-white mt-10">Meet The Team</p>
            <div className="flex flex-row space-x-10 items-center justify-center mt-10">
                {teamMembers.map((member, index) => (
                    <div class="max-w-sm rounded overflow-hidden shadow-lg" key={index}>
                        <img class="w-full" src={member.imgUrl} alt={member.name} />
                        <div class="px-6 py-4">
                            <div class="font-bold text-xl mb-2 text-slate-200">{member.name}</div>
                            <p class="text-slate-300 text-base">
                                {member.description}
                            </p>
                        </div>
                        <div class="px-6 pt-4 pb-2">
                            {member.tags.map((tag, index) => (
                                <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2" key={index}>{tag}</span>
                            ))}
                        </div>
                        <div class="px-6 pt-4 pb-2">
                            <button class="mr-2 mb-2 inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded w-full" href={member.website} target="_blank">
                                Personal Website
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}