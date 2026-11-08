// Hero.tsx: the big title at the top of the page, with a link down to the products.
export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <h1 id="hero-title" className="hero-title">
        Sell smarter.
      </h1>
      <p className="hero-text">Everything your shop needs, in one board.</p>
      <div>
        <a className="btn btn-primary btn-lg" href="#products">
          Shop now
        </a>
      </div>
    </section>
  );
}
