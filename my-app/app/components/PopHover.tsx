interface PopHoverProps {
  title: string;
}
const PopHover = ({ title }: PopHoverProps) => {
  return (
    <div className="popHover absolute z-50 flex flex-col w-max items-center transform -translate-x-1/2 -translate-y-full left-1/2">
      <p className="bg-white text-black border text-sm shadow-2xl shadow-[#000000cf] px-3 py-1 rounded-md">
        {title}
      </p>
      <div className="border-8 border-b-transparent border-l-transparent border-r-transparent border-t-white shadow-[#000000cf] shadow-2xl"></div>
    </div>
  );
};

export default PopHover;
