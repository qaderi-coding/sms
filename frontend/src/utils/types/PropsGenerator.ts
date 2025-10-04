import BaseInputProps, { FileFieldType, InputContext, InputType, SelectFieldType } from '../../ui-custom/props/BaseInputProps';
import { Dictionary } from './IDictionary';
import SelectFieldProps, { dispatchModeType, SelectOptionsSelector, SelectReducerAction } from '../../ui-custom/props/SelectFieldProps';
import TextFieldProps from '../../ui-custom/props/TextFieldProps';
import CheckboxFieldProps from '../../ui-custom/props/CheckboxFieldProps';
import TextAreaFieldProps from '../../ui-custom/props/TextAreaFieldProps';
import RadioFieldProps from '../../ui-custom/props/RadioFieldProps';
import AutoCompleteFieldProps, { AutoCompleteOptionsSelector, AutoCompleteReducerAction } from 'ui-custom/props/AutoCompleteFieldProps';

export default class PropsGenerator<T extends BaseInputProps> {
    item: T;

    constructor(item: T, name: string, type: InputType, prefix: string) {
        this.item = item;
        this.setName(name);
        this.setLabel(name);
        this.setType(type);
        this.setPrefix(prefix);
    }

    static create<TEntity, T extends BaseInputProps>(item: T, name: keyof TEntity, type: InputType, prefix: any = '') {
        return new this(item, name as string, type, prefix);
    }

    static text<TEntity>(name: keyof TEntity, prefix: any = '') {
        return new this<TextFieldProps>(new TextFieldProps(), name as string, 'text', prefix);
    }

    static number<TEntity>(name: keyof TEntity, prefix: any = '') {
        return new this<TextFieldProps>(new TextFieldProps(), name as string, 'text', prefix);
    }

    static date<TEntity>(name: keyof TEntity, prefix: any = '') {
        return new this<TextFieldProps>(new TextFieldProps(), name as string, 'text', prefix);
    }

    static file<TEntity>(name: keyof TEntity, type: FileFieldType, prefix: any = '') {
        return new this<SelectFieldProps>(new SelectFieldProps(), name as string, type, prefix);
    }

    static checkbox<TEntity>(name: keyof TEntity, prefix: any = '') {
        return new this<CheckboxFieldProps>(new CheckboxFieldProps(), name as string, 'checkbox', prefix);
    }

    static radio<TEntity>(name: keyof TEntity, prefix: any = '') {
        return new this<RadioFieldProps>(new RadioFieldProps(), name as string, 'radio', prefix);
    }

    static textArea<TEntity>(name: keyof TEntity, prefix: any = '') {
        return new this<TextAreaFieldProps>(new TextAreaFieldProps(), name as string, 'textarea', prefix);
    }

    static singleSelect<TEntity>(name: keyof TEntity, prefix: any = '') {
        return new this<SelectFieldProps>(new SelectFieldProps(), name as string, 'single-select', prefix);
    }

    static multipleSelect<TEntity>(name: keyof TEntity, type: SelectFieldType, prefix: any = '') {
        return new this<SelectFieldProps>(new SelectFieldProps(), name as string, 'multiple-select', prefix);
    }

    static singleAutoComplete<TEntity>(name: keyof TEntity, prefix: any = '') {
        return new this<AutoCompleteFieldProps>(new AutoCompleteFieldProps(), name as string, 'single-complete', prefix);
    }

    setProp(prop: keyof T, value: any) {
        (this.item as Dictionary)[prop as string] = value;
        return this;
    }

    setName<T>(name: keyof T) {
        this.item.name = name as string;
        return this;
    }

    setLabel(label: string) {
        this.item.label = label;
        return this;
    }

    setPrefix(prefix: string) {
        if (prefix) this.item.name = `${prefix}.${this.item.name}`;
        return this;
    }

    setValue(value: any) {
        this.item.value = value;
        return this;
    }

    setCustomValue(value: any) {
        this.item.customValue = value;
        return this;
    }
    setType(type: InputType) {
        this.item.type = type;
        return this;
    }
    // TODO: add default value to readonly=true
    setReadonly(readonly: boolean = true) {
        this.item.readonly = readonly;
        return this;
    }

    setTranslate(translate: boolean) {
        this.item.translate = translate;
        return this;
    }

    setContext(context: InputContext) {
        this.item.context = context;
        return this;
    }

    setOnChange(onChange: any) {
        this.item.onChange = onChange;
        return this;
    }

    setOnChangeAction(onChangeAction: any) {
        this.item.onChangeAction = onChangeAction;
        return this;
    }
    setOnDoubleClickAction(onDoubleClickAction: any) {
        this.item.onDoubleClickAction = onDoubleClickAction;
        return this;
    }
    setOnEnterClickAction(onEnterClickAction: any) {
        this.item.onEnterClickAction = onEnterClickAction;
        return this;
    }

    setOnBlur(onBlur: any) {
        this.item.onBlur = onBlur;
        return this;
    }

    setOptions<TEntity>(options: TEntity[] | SelectReducerAction<TEntity>, optionSelector: SelectOptionsSelector<TEntity>) {
        if (this.item instanceof SelectFieldProps) {
            this.item.optionSelector = optionSelector;
            if (options instanceof SelectReducerAction) {
                this.item.reducerOptions = options;
            } else {
                this.item.arrayOptions = options;
            }
        } else {
            throw new Error(`Options can only be set on SelectFieldProps for ${this.item.name}`);
        }
        return this;
    }

    setAutoCompleteOptions<TEntity>(
        options: TEntity[] | AutoCompleteReducerAction<TEntity>,
        optionAutoComplete: AutoCompleteOptionsSelector<TEntity>,
        valueLabel?: any
    ) {
        if (this.item instanceof AutoCompleteFieldProps) {
            this.item.optionSelector = optionAutoComplete;
            this.item.valueLabel = valueLabel;
            this.setProp('valueLabel', valueLabel);
            if (options instanceof Array) {
                this.item.arrayOptions = options;
            } else {
                this.item.reducerOptions = options;
            }
        } else {
            throw new Error('Load options can only be set on AutoCompleteFieldProps');
        }
        return this;
    }

    setToggleValues(truthyValue: string | boolean, falsyValue: string | boolean) {
        if (this.item instanceof CheckboxFieldProps || this.item instanceof RadioFieldProps) {
            this.item.truthyValue = truthyValue;
            this.item.falsyValue = falsyValue;
        } else {
            throw new Error('ToggleValues can only be set on CheckboxFieldProps');
        }
        return this;
    }

    setSx(sx: any) {
        this.item.sx = sx;
        return this;
    }

    render() {
        return this.item;
    }
}

