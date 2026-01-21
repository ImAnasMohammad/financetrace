

const CategoryWiseSpend = ({sortedCategoryExpenses}) => {
    return (<div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">
            Category-wise Spend
        </h3>

        {sortedCategoryExpenses.length ? (
            <ul className="space-y-3">
                {sortedCategoryExpenses.map((cat, index) => (
                    <li
                        key={index}
                        className="flex justify-between items-center border-b pb-2"
                    >
                        <span className="font-medium text-gray-700">
                            {cat.name}
                        </span>
                        <span className="font-semibold text-red-600">
                            ₹{cat.value.toLocaleString()}
                        </span>
                    </li>
                ))}
            </ul>
        ) : (
            <p className="text-gray-500 text-center py-8">
                No expense data available
            </p>
        )}
    </div>
    )
}

export default CategoryWiseSpend