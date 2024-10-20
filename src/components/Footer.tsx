export default function Footer({ styles }: { styles: CSSModuleClasses }) {
    return (
      <>
        <footer className={`${styles.footer} bg-dark py-3 mt-auto `}>
          <div className="container ">
            <span className="text-light">&copy; CampNest</span>
          </div>
        </footer>
      </>
    );
  }
  