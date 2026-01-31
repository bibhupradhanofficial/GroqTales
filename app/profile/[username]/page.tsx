import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileStats } from "@/components/profile/profile-stats";
import { StoryCard } from "@/components/profile/story-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const mockUser = {
  displayName: "Alex The Creator",
  username: "alexcodes",
  bio: "Weaving AI dreams into Web3 reality. Sci-fi enthusiast and prompt engineer.",
  walletAddress: "0x71C0000000000000000000000000000000009A23",
  isOwner: true,
};

const mockStories = Array(6).fill(null).map((_, i) => ({
  title: `The Neon Horizon ${i + 1}`,
  excerpt: "In a world where algorithms dream of electric sheep, one droid stood apart...",
  coverImage: "/neon-light.avif", 
  likes: 42 + i * 5,
  comments: 12,
  isNFT: i % 3 === 0,
  genre: "Sci-Fi"
}));

export default function ProfilePage({ params }: { params: { username: string } }) {
  const user = { ...mockUser, username: params.username };
  return (
    <main className="min-h-screen bg-black text-slate-200 pb-20">
      <ProfileHeader user={user} />
      
      <div className="container mx-auto px-4">
        <ProfileStats />
        
        <div className="mt-8">
          <Tabs defaultValue="stories" className="w-full">
            <div className="flex justify-center md:justify-start mb-6">
              <TabsList className="bg-slate-900 border border-slate-800">
                <TabsTrigger value="stories">Stories</TabsTrigger>
                <TabsTrigger value="collections">Collections</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="stories" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockStories.map((story, idx) => (
                  <StoryCard key={idx} story={story} />
                ))}
              </div>
              
              {mockStories.length === 0 && (
                <div className="text-center py-20 text-slate-500">
                  <p className="text-lg">No stories told yet.</p>
                  <button className="mt-4 text-violet-400 hover:underline">Create your first story</button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="collections">
              <div className="p-10 text-center text-slate-500 bg-slate-900/30 rounded-lg border border-slate-800 border-dashed">
                Collections feature coming soon.
              </div>
            </TabsContent>
            
            <TabsContent value="activity">
              <div className="p-10 text-center text-slate-500 bg-slate-900/30 rounded-lg border border-slate-800 border-dashed">
                Activity feed coming soon.
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
}