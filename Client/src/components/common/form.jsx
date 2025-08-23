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
  isBtnDisabled
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

      case "select":
        element = (
          <Select className="bg-white" onValueChange={(value) => setFormData({
            ...formData, [getControlItem.name]: value
          })} value={value}>
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder={getControlItem.placeholder} />
            </SelectTrigger>

            <SelectContent className="bg-white">
              {getControlItem.options &&
                getControlItem.options.length > 0 &&
                getControlItem.options.map((optionItem) =>
                  optionItem ? (
                    <SelectItem key={optionItem.id} value={optionItem.id} className="hover:bg-black hover:text-white transition-all cursor-pointer">
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
            type={getControlItem.type}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
            // rows={getControlItem.rows}
            // cols={getControlItem.cols}
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
          <div className="grid w-full gap-1 " key={controlItem.name}>
            <label htmlFor={controlItem.label}>{controlItem.label}</label>
            {renderInputsByComponentType(controlItem)}
          </div>
        ))}
      </div>

      <Button disabled={isBtnDisabled} type="submit" className="mt-6 w-full bg-black text-white cursor-pointer">
        {buttonText || "Submit"}
      </Button>
    </form>
  );
}

export default CommonForm;
