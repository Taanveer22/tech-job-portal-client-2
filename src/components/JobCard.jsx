import { Link } from 'react-router';

const JobCard = ({ jobItem }) => {
  // console.log(jobItem);
  const { _id, company, company_logo, description, title } = jobItem;
  return (
    <div className="card bg-base-300 shadow-sm">
      <div className="flex justify-around">
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
