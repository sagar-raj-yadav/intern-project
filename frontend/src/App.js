import React, { useState } from 'react';
import TransactionsTable from './components/TransactionsTable';
import Statistics from './components/Statistics';
import CustomBarChart from './components/BarChart';
import CustomPieChart from './components/PieChart';
import CombinedData from './components/CombinedData';

const App = () => {
    const [month, setMonth] = useState('');

    const handleMonthChange = (e) => {
        setMonth(e.target.value);
    };

    return (
        <div className="App">
            <h1><u>Transactions Dashboard</u></h1>
            <input
                type="text"
                placeholder="Enter month (YYYY-MM format) ,Ex:2022-05"
                value={month}
                onChange={handleMonthChange}
                style={{padding:"10px",width:"300px",margin:"10px 0 10px 30px",borderRadius:"15px",fontSize:"15px"}}
            />
            <TransactionsTable month={month} />
            <hr/>
            <Statistics month={month} />
            <hr/>
            <CustomBarChart month={month} />
            <hr/>
            <CustomPieChart month={month} />
            
            <CombinedData month={month} />
        </div>
    );
};

export default App;

// import React, { useState } from 'react';
// import TransactionsTable from './components/TransactionsTable';
// import Statistics from './components/Statistics';
// import CustomBarChart from './components/BarChart';
// import CustomPieChart from './components/PieChart';
// import CombinedData from './components/CombinedData';

// const App = () => {
//     const [month, setMonth] = useState('');

//     const handleMonthChange = (e) => {
//         setMonth(e.target.value);
//     };

//     return (
//         <div className="App">
//             <h1><u>Transactions Dashboard</u></h1>
//             <input
//                 type="text"
//                 placeholder="Enter month (YYYY-MM format) ,Ex:2022-05"
//                 value={month}
//                 onChange={handleMonthChange}
//                 style={{padding:"10px",width:"300px",margin:"10px 0 10px 30px",borderRadius:"15px",fontSize:"15px"}}
//             />
//             <TransactionsTable month={month} />
//             <hr/>
//             <Statistics month={month} />
//             <hr/>
//             <CustomBarChart month={month} />
//             <hr/>
//             <CustomPieChart month={month} />
            
//             <CombinedData month={month} />
//         </div>
//     );
// };

// export default App;
