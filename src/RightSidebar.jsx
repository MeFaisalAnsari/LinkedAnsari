import React from "react";
import AnnouncementRoundedIcon from "@mui/icons-material/AnnouncementRounded";
import CircleIcon from "@mui/icons-material/Circle";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

const RightSidebar = () => {
  const News = ({ title, hour }) => {
    return (
      <div className="flex gap-2 py-1 px-3 hover:bg-gray-100 cursor-default">
        <CircleIcon sx={{ fontSize: 8 }} className="text-gray-600 mt-2" />
        <div>
          <h5 className="font-semibold text-sm text-gray-600">{title}</h5>
          <p className="text-xs text-gray-400 mt-1">{hour}h ago</p>
        </div>
      </div>
    );
  };
  return (
    <div className="fixed w-80">
      <div className="bg-white rounded-lg overflow-hidden border py-4">
        <div className="flex justify-between mb-2 px-3">
          <h4 className="text-sm font-semibold text-gray-600">LinkedIn News</h4>
          <AnnouncementRoundedIcon sx={{ fontSize: 18 }} />
        </div>
        <News title="IT majors record profile rise" hour={5} />
        <News title="Global accounting firms go local" hour={5} />
        <News title="IIM classrooms get diverse" hour={5} />
        <News title="Travel loans rise in non-metros" hour={5} />
        <News title="Vehicle financing to zoom ahead" hour={5} />
      </div>
      <div className="bg-white rounded-lg overflow-hidden border py-4 mt-2">
        <div className="flex justify-end gap-2 mb-2 px-3">
          <p className="text-sm">Ad</p>
          <MoreHorizIcon sx={{ fontSize: 20 }} />
        </div>
        <div className="text-center px-4 py-8">
          <p className="text-sm text-gray-500 mb-4">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro error
            officia provident hic tenetur quasi exercitationem delectus.
          </p>
          <button className="py-2 px-6 text-sky-600 border border-sky-600 rounded-full text-sm font-semibold cursor-default">
            Learn more
          </button>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
