function MainButton({ children }: {children: string}) {
    return (
        <button
            type="submit"
            className="border border-indigo-50 rounded-xl bg-indigo-950 py-2 px-8 text-violet-100 text-xl hover:scale-105 hover:bg-indigo-900 transition-all">
            {children}
        </button>
    )
}

export default MainButton;