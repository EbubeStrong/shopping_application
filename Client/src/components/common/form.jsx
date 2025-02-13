import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

function CommonForm({
  formControls,
  formData,
  setFormData,
  onSubmit,
  buttonText,
}) {
  const renderInputsByComponentType = (getControlItem) => {
    let element = null;
    const value = formData[getControlItem.name] || "";

    switch (getControlItem.componentType) {
      case "input":
        element = (
          <Input
            name={getControlItem.name}
            type={getControlItem.type}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
            value={value}
            onChange={(e) => {
              setFormData({
                ...formData,
                [getControlItem.name]: e.target.value,
              });
            }}
          />
        );
        break;

      case "textarea":
        element = (
          <Textarea
            name={getControlItem.name}
            // type={getControlItem.type}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
            value={value}
          />
        );
        break;

      case "select":
        element = (
          <Select onValueChange={(value) => setFormData({
            ...formData, [getControlItem.name]: value
          })} value={value}>
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
          <Textarea
            name={getControlItem.name}
            // type={getControlItem.type}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
          />
        );
        break;
    }
    return element;
  };
  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-3">
        {formControls.map((controlItem) => (
          <div className="grid w-full gap-1 5" key={controlItem.name}>
            <label htmlFor="userName">{controlItem.label}</label>
            {renderInputsByComponentType(controlItem)}
          </div>
        ))}
      </div>
      
      <Button type="submit" className="mt-2 w-full">
        {buttonText || "Submit"}
      </Button>
    </form>
  );
}

export default CommonForm;
