interface PageContainerProps extends React.HTMLProps<HTMLDivElement> {
    gap?: number;
}

const PageContainer = (props: PageContainerProps) => {

    const {gap, children} = props;
    return (<div className={'w-full h-full flex flex-col items-center justify-center  py-15 scroll-hidden'}>
        <div className={` relative w-full max-w-4xl min-h-full h-full ${gap ? "gap-" + gap : "gap-5"} flex items-center flex-col scroll-hidden`}>
            {children}

        </div>
    </div>)

}

PageContainer.displayName = "PageContainer";
export default PageContainer;

