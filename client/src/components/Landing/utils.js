export const scrollToSection = (id) => {
   const element = document.getElementById(id);
   if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
         top: offsetPosition,
         behavior: "smooth"
      });
   }
};
