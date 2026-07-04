import PropTypes from "prop-types";

export function Heading({ label }) {
    return (
        <div className="text-2xl font-semibold">
            {label}
        </div>
    );
}


Heading.propTypes = {
    label: PropTypes.string.isRequired,
};