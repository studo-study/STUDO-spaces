type PageContainerProps = React.HTMLProps<HTMLDivElement>
const PageContainer = (props: PageContainerProps) => {

    const {children} = props;
    return (<div className=" relative w-full min-h-full h-full py-15 flex flex-col gap-10 scroll-hidden">
        <section className={"w-full h-fit"}>{children}
        </section>
    </div>)

}

PageContainer.displayName = "PageContainer";
export default PageContainer;

