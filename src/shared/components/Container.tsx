const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="w-full h-fit max-w-275 mx-auto px-4 py-6">{children}</section>
  );
};

export default Container;
