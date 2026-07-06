import { Link, useLocation } from "react-router-dom";

interface PageTitleProps {
  title: string | null;
  searchbar?: boolean;
  searchFunction?: (input: string) => void;
}
const PageTitle: React.FC<PageTitleProps> = (props) => {
  const { title } = props;
  const pathName = useLocation().pathname;
  const path = pathName.split("/");
  return (
    <div className={"flex flex-row justify-starts items-center p-0 mb-3"}>
      <h1 className={"font-bold text-2xl flex flex-row"}>
        {title ? (
          <span className={"capitalize"}>{title}</span>
        ) : (
          path.splice(1, path.length).map((item, index) => (
            <div key={index}>
              <Link
                to={"/" + item}
                className={
                  "hover:bg-neutral-200  capitalize rounded-xl px-2 py-1 cursor-pointer mx-1"
                }
              >
                {item}
              </Link>
              {index != path.length && "/"}
            </div>
          ))
        )}
      </h1>
    </div>
  );
};

PageTitle.displayName = "PageTitle";
export default PageTitle;
