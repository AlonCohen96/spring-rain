import React from 'react';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';

function OwnershipChart({insiderOwnership, institutionalOwnership, retailOwnership}) {

    const data = [
        { name: 'Insiders', value: insiderOwnership },
        { name: 'Institutions', value: institutionalOwnership },
        { name: 'Retail', value: retailOwnership}
    ];

    const COLORS = ['#08bdbd', '#00C49F', '#8fc0a9', '#FF8042'];

    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, names }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.3;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${data[index].name} ${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

        return (
            <ResponsiveContainer width="100%" height="100%" >
                <PieChart width={400} height={400}>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={160}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
        );
    }

export default OwnershipChart
