const PageLayout = ({ children, frontMatter }) => {
  const { title } = frontMatter;

  return (
    <>
      <article className="docs prose dark:prose-invert prose-a:break-words mx-auto p-6">
        <header>
          <div className="mb-4 flex-col items-center">
            {title && <h1 className="flex justify-center">{title}</h1>}
          </div>
        </header>
        {children}
      </article>
    </>
  );
};

export default PageLayout;
