import { Table as StyledTable } from './style'
type Column<T> = {
    key: keyof T;
    label: string;
    render?: (value: any, row: T) => React.ReactNode;
};

type TableProps<T> = {
    columns: Column<T>[];
    data: T[];
};


const Table = <T extends Record<string, unknown>>({ columns, data }: TableProps<T>) => {
    return (
        <StyledTable>
            <thead>
                <tr>
                    {columns.map((col) => (
                        <th key={String(col.key)}>{col.label}</th>
                    ))}
                </tr>
            </thead>

            <tbody>
                {data.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        {columns.map((col) => (
                            <td
                                key={String(col.key)}
                                data-label={col.label}
                            >
                                {col.render
                                    ? col.render(row[col.key], row)
                                    : String(row[col.key])}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </StyledTable>
    )
}

export default Table