const SectionTitle = ({ subtitle, title, centered = true }) => {
  return (
    <div className={`mb-12 ${centered ? "text-center" : ""}`}>
      {subtitle && (
        <span className="text-gold-400 font-medium tracking-wider uppercase text-sm">
          {subtitle}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-900 mt-2">
        {title}
      </h2>
      <div className={`gold-line mt-4 ${centered ? "mx-auto" : ""}`}></div>
    </div>
  );
};

export default SectionTitle;
