const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="w-full h-fit max-w-275 mx-auto p-4 sm:p-6">{children}</section>
  );
};

export default Container;
