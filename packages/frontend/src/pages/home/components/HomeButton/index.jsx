const HomeButton = ({ children, onClick, className = '' }) => {
    const baseClass = `
    shadow-[inset_0_0_0_2px_#616467] 
    text-black 
    px-12 
    py-4 
    rounded-full 
    tracking-widest 
    uppercase 
    font-bold 
    bg-transparent 
    hover:bg-[#616467] 
    hover:text-white 
    dark:text-neutral-200 
    transition 
    duration-200
  `;
    return (
        <button onClick={onClick} className={`${baseClass} ${className}`}>
            {children}
        </button>
    );
}
export default HomeButton
