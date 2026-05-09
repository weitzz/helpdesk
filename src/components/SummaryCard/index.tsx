type SummaryCardItem = {
    label: string
    value: React.ReactNode
}

type SummaryCardProps = {
    title: string
    items: SummaryCardItem[]
}

const SummaryCard = ({ title, items }: SummaryCardProps) => {
    return (
        <div
            style={{ backgroundColor: '#f7f7f7', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
            <h3>{title}</h3>

            {items.map((item, index) => (
                <p key={index}>
                    <strong>{item.label}:</strong> {item.value}
                </p>
            ))}
        </div>
    )
}

export default SummaryCard