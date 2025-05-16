import { useEffect, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { getFriendList, sendFriendRequest } from '@/store/slices/userSlices';
import RequestItem from './RequestItem';

const RequestList = () => {
  const dispatch = useDispatch();

  const [searchId, setSearchId] = useState("");
  const [open, setOpen] = useState(false);

  const friendList = useSelector(state => state.user?.friendList || [], shallowEqual);

  const handleSendFriendRequest = async () => {
    const { payload = {} } = await dispatch(sendFriendRequest({ id: searchId }));
    const { status = "", message = "", code = "" } = payload || {};

    if (status === "success") {
      showSuccessToast(message);
    } else if (status === "fail") {
      showErrorToast(message);
    } else {
      showErrorToast("Something went wrong, Pls try again!");
    }

    // Close the popover after sending the friend request
    setOpen(false);
  }

  useEffect(() => {
    const fetchFriendList = () => {
      dispatch(getFriendList());
    }

    fetchFriendList();
  }, []);

  return (
    <div className="w-80 bg-white border-r">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-xl font-semibold">Friend List</h2>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger className="text-blue-500 text-1xl font-medium">
            Add Friends
          </PopoverTrigger>
          <PopoverContent className="w-96 bg-white shadow-lg rounded-lg p-6 border border-gray-200">
            <div className="space-y-4">
              <div>
                <label htmlFor="hash" className="block text-sm font-medium text-gray-700">
                  <span className="text-lg font-semibold tracking-tight mb-2 block text-gray-900">Search by ID</span>
                </label>
                <input
                  type="text"
                  id="hash"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 sm:text-sm p-2"
                  placeholder="Enter Identification Number"
                />
              </div>
              <button
                onClick={handleSendFriendRequest}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Search
              </button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div className="overflow-y-auto h-[calc(100vh-60px)]">
        {friendList.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 bg-white rounded-lg shadow-lg border border-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <p className="text-2xl font-bold text-gray-800">No Friends</p>
            <p className="mt-2 text-md text-gray-600">Start adding friends to see here!</p>
          </div>
        ) : (
            friendList.map((msg, index) => (
            <RequestItem
              key={index}
              {...msg}
              enableToggle={false}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default RequestList;