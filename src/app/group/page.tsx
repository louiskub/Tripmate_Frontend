import DefaultPage from '@/components/layout/default-layout';
import Searchicon from '@/assets/icons/search.svg'
import Groupicon from '@/assets/icons/group.svg'

export default function BookingHistory() {
  return (
    <DefaultPage>
    <main className="flex-1">
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Searchicon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
            <input
              placeholder=""
              className="pl-12 w-full h-12 bg-white border-2 border-gray-300 rounded-lg"
            />
          </div>
          <button className="bg-blue-500 hover:bg-blue-600 text-white h-12 px-6 rounded-lg whitespace-nowrap">
            Create Group
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between px-6">
        <p className="text-gray-600 font-medium">Found 0 groups</p>
        <div className="flex items-center space-x-6">
          <span className="text-gray-600 font-medium">Sort by option1</span>
          <span className="text-gray-600 font-medium">View</span>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-16">
        <div className="mb-8">
          <div className="relative w-100 h-100">
            <Groupicon className="w-full h-full text-gray-400" />
          <div className="absolute top-60 left-73">
            <div className="w-30 h-30 bg-gray-700 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
              <Searchicon className="h-15 w-15 text-white" />
            </div>
          </div>
          </div>
        </div>
        <h3 className="relative text-2xl font-bold text-gray-700 text-center bottom-10">No groups were found for this view</h3>
      </div>
    </main>
    </DefaultPage>
  );
}
