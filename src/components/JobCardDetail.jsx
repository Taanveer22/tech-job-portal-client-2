import { Link, useLoaderData } from 'react-router';

const JobCardDetail = () => {
  const loadedDetailsData = useLoaderData();
  //   console.log(loadedDetailsData);

  const {
    _id,
    company,
    location,
    company_logo,
    description,
    title,
    jobType,
    requirements,
    responsibilities,
    salaryRange,
  } = loadedDetailsData;

  return (
    <div className="w-11/12 max-w-6xl mx-auto mb-8 lg:mb-16">
      <div className="card bg-base-300 py-4 shadow-sm">
        <div className="flex justify-around items-center">
          <img src={company_logo} className="w-12" />
          <h2 className="text-2xl font-medium">{company}</h2>
          <p>{location}</p>
        </div>
        <div className="card-body">
          <h2 className="card-title">{title}</h2>
          <div className="card-actions justify-between">
            {requirements.map((element, index) => (
              <div key={index} className="badge badge-outline">
                {element}
              </div>
            ))}
          </div>
          <p>{jobType}</p>
          <p>{description}</p>
          <div className="card-actions justify-between">
            {responsibilities.map((element, index) => (
              <div key={index} className="badge badge-dash">
                {element}
              </div>
            ))}
          </div>
          <div>
            <span>Salary : </span>
            <span>{salaryRange.min} - </span>
            <span>{salaryRange.max} </span>
            <span>{salaryRange.currency}</span>
          </div>
          <div className="flex justify-center items-center">
            <Link to={`/jobApply/${_id}`} className="btn btn-warning">
              Apply For This Position
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCardDetail;
