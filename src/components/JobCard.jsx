import { FaDeleteLeft } from 'react-icons/fa6';
import { Link } from 'react-router';

const JobCard = ({ jobItem, handleDeleteJob }) => {
  // console.log(jobItem);
  const { _id, company, company_logo, description, title } = jobItem;
  return (
    <div className="card bg-base-300 shadow-sm relative">
      <button onClick={() => handleDeleteJob(_id)} className="absolute top-2 right-2 text-red-500">
        <FaDeleteLeft size={30}></FaDeleteLeft>
      </button>
      <div className="flex gap-3 items-center pt-3">
        <img src={company_logo} className="w-12" />
        <h2 className="card-title">{company}</h2>
      </div>
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        <p>{description}</p>
        <Link to={`/jobCard/${_id}`}>
          <button className="btn btn-sm btn-info btn-block">Apply</button>
        </Link>
      </div>
    </div>
  );
};

export default JobCard;
