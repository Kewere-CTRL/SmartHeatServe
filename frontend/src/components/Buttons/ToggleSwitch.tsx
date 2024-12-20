
interface ToggleSwitchForControllerProps {
    groupParameters: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ToggleSwitchForController: React.FC<ToggleSwitchForControllerProps> = ({ groupParameters, onChange }) => {
    return (
        <div className="group-parameters max-w-[300px]">
            <label htmlFor="group-parameters-switch" className="flex items-center cursor-pointer">
                <div className="relative">
                    <input
                        type="checkbox"
                        id="group-parameters-switch"
                        checked={groupParameters}
                        onChange={onChange}
                        className="sr-only"
                    />
                    <div
                        className={`block w-10 h-6 rounded-full ${groupParameters ? 'bg-gray-700' : 'bg-gray-300'}`}
                    ></div>
                    <div
                        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                            groupParameters ? 'transform translate-x-4' : ''
                        }`}
                    ></div>
                </div>
            </label>
        </div>
    );
};

export default ToggleSwitchForController;
