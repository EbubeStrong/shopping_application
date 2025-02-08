import { SelectItem, SelectTrigger } from "@radix-ui/react-select";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectValue } from "../ui/select";

function CommonForm({ formControls }) {
  const renderInputsByComponentType = (getControlItem) => {
    let element = null;

    switch (getControlItem.componentType) {
      case "input":
        element = (
          <Input
            name={getControlItem.name}
            type={getControlItem.type}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
          />
        );
        break;

      case "textarea":
        element = (
          <Input
            name={getControlItem.name}
            type={getControlItem.type}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
          />
        );
        break;

      case "select":
        element = (
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={getControlItem.placeholder} />
            </SelectTrigger>

            <SelectContent>
              {getControlItem.options &&
                getControlItem.options.length > 0 &&
                getControlItem.options.map((optionItem) =>
                  optionItem ? ( 
                    <SelectItem key={optionItem.id} value={optionItem.id}>
                      {optionItem.label}
                    </SelectItem>
                  ) : null
                )}
            </SelectContent>
          </Select>
        );
        break;

      default:
        element = (
          <Input
            name={getControlItem.name}
            type={getControlItem.type}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
          />
        );
        break;
    }
    return element;
  };
  return (
    <form>
      <div className="flex flex-col gap-3">
        {formControls.map((controlItem) => (
          <div className="grid w-full gap-1 5" key={controlItem.name}>
            <label htmlFor="userName">controlItem.label</label>
            {renderInputsByComponentType(controlItem)}
          </div>
        ))}
      </div>
    </form>
  );
}

export default CommonForm;
