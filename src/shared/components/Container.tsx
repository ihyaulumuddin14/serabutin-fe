const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="w-full h-fit max-w-300 mx-auto my-4 px-4 sm:px-0 sm:m-6">{children}</section>
  );
};

export default Container;
