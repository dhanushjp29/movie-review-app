import { FaUserTie } from "react-icons/fa";

const PersonCard = ({ person }) => (
  <a
    href={person.searchUrl}
    target="_blank"
    rel="noopener noreferrer"
    title={`Search ${person.name}`}
    className="group flex w-20 shrink-0 flex-col items-center text-center"
  >
    <div className="relative h-20 w-20 overflow-hidden rounded-full border border-cinema-700/50 transition group-hover:border-cinema-accent">
      <img
        src={person.image}
        alt={person.name}
        loading="lazy"
        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
      />
    </div>
    <p className="mt-2 line-clamp-2 w-full text-xs font-medium text-heading">
      {person.name}
    </p>
    <p className="mt-0.5 line-clamp-2 w-full text-[11px] text-muted">
      {person.role}
    </p>
  </a>
);

const CastSection = ({ director, castMembers }) => {
  const people = [
    ...(director ? [director] : []),
    ...(castMembers ?? []),
  ];

  if (people.length === 0) return null;

  return (
    <section className="mt-8 min-w-0">
      <h2 className="flex items-center gap-2 text-lg font-semibold text-heading">
        <FaUserTie className="text-cinema-accent" />
        Director & Cast
      </h2>
      <div className="mt-4 w-full max-w-full overflow-x-auto overflow-y-hidden pb-2 scrollbar-thin">
        <div className="flex w-max gap-4 pr-1">
          {people.map((person) => (
            <PersonCard key={`${person.id}-${person.role}`} person={person} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CastSection;
