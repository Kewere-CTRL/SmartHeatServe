interface TableContainerProps {
    children: React.ReactNode;
    maxHeight?: string;
}

const TableContainer = ({ children, maxHeight = "300px" }: TableContainerProps) => {
    return (
        <div
            className={`inline-block overflow-y-auto border-3`}
            style={{ maxHeight }}
        >
            {children}
        </div>
    );
};

export default TableContainer;
