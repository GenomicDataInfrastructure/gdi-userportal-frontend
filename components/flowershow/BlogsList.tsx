const BlogsList = ({ blogs }) => {
  return (
    <div className="mx-auto mt-12 grid max-w-lg gap-5 lg:max-w-none lg:grid-cols-3">
      {blogs.map((post) => (
        <div
          key={post.title}
          className="flex flex-col overflow-hidden rounded-lg shadow-lg"
        >
          <div className="flex-shrink-0">
            {post.thumbnail && (
              <img
                className="h-48 w-full object-cover"
                src={post.thumbnail}
                alt=""
              />
            )}
          </div>
          <div className="flex flex-1 flex-col justify-between bg-white p-6">
            <div className="flex-1">
              <a href={post.url_path} className="mt-2 block">
                <p className="text-xl font-semibold text-gray-900">
                  {post.title}
                </p>
                <p className="mt-3 text-base text-gray-500">{post.summary}</p>
              </a>
            </div>
            <div className="mt-6 flex items-center">
              <div className="flex space-x-1 text-sm text-gray-500">
                <time dateTime={post.created}>{post.created}</time>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BlogsList;
