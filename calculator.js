var is_Number = false, is_Decimal = false, is_Operator = false, is_Constant = false, is_Executed = false;
var Value = "0", aValue = " ", Operator = "", Value_1_set = false, Value_1 = 0, Operator_1 = 0;
var Value_2_set = false, Value_2 = 0, Operator_2 = 0, Operator_last = 0, Value_3_set = false, Value_3 = 0, Operator_3 = 0;
var current_num = "", func_last = "", val = "", val_1 = "", val_2 = "", ans = "", Oper = "", TestDecimal = "";
var cs_clear_button = document.getElementById("clear_display");

function cs_preconditions() {
    var c = true;
    var displayValue = document.cs_calculator_form.cs_display.value;
    if (displayValue === "NaN" || displayValue === "Not a Number" || displayValue === "Infinity" || displayValue === "Error") {
        c = false;
    }
    return c;
}

function cs_numberWithCommas(c) {
    c = c.toString().split(".");
    c[0] = c[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return c.join(".");
}

function cs_removeCommas(c) {
    return c.toString().replace(/,/g, "");
}

function cs_displayValue(c) {
    document.cs_calculator_form.cs_display.value = cs_numberWithCommas(c);
}

function cs_enterValue(c) {
    current_num = c;
    var d = RegExp("^[0-9]$");
    if ((d.test(c) || c === ".") && cs_preconditions() && (document.cs_calculator_form.cs_display.value !== "0" || c !== "0") && (c !== "." || !is_Decimal)) {
        cs_clear_button.innerHTML = "CE";
        if (is_Operator || is_Executed || is_Constant) {
            cs_resetFlags();
            if (c === ".") {
                Value = "0.";
                is_Number = is_Decimal = true;
            } else if (d.test(c)) {
                Value = c;
                is_Number = true;
            }
        } else {
            cs_resetFlags();
            if (c === "." && document.cs_calculator_form.cs_display.value === "0") {
                Value = "0.";
                is_Decimal = true;
            } else if (Value === "0" && c !== ".") {
                Value = c;
            } else {
                Value += c;
                if (c === "." || Value.indexOf(".") !== -1) {
                    is_Decimal = true;
                }
                is_Number = true;
            }
        }
        cs_displayValue(Value);
    }
}

function cs_display_backspace() {
    Value = cs_removeCommas(document.cs_calculator_form.cs_display.value);
    if (document.cs_calculator_form.cs_display.value.indexOf("e") === -1) {
        Value = Value.toString().substring(0, Value.length - 1);
        if (Value === "") {
            Value = "0";
        }
        cs_displayValue(Value);
    }
}

function cs_enterOperator(c) {
    if (cs_preconditions()) {
        Operator = c;
        if (Operator === "=" && Operator_last === "=" && (is_Operator || is_Executed || (!Value_1_set && !Value_2_set)) && Value_3_set && Value !== " " && ["+", "-", "*", "/", "="].includes(Operator_3)) {
            Value_1 = Value;
            Value_1_set = true;
            Operator_1 = Operator_3;
            Value_2 = Value_3;
            Value_2_set = true;
            cs_execute();
            aValue = cs_formatResult(aValue);
            cs_displayValue(aValue);
            cs_clear_button.innerHTML = "AC";
            cs_resetValues();
        } else if (Operator !== "=" || !["nCr", "nPr", "e"].includes(Operator_3) || !is_Executed) {
            Operator_last = c;
            if (is_Operator && Value_1_set && !Value_2_set) {
                if (Operator === "=") {
                    Value_2 = Value_1;
                    Value_2_set = true;
                    cs_execute();
                    aValue = cs_formatResult(aValue);
                    cs_displayValue(aValue);
                    cs_clear_button.innerHTML = "AC";
                    cs_resetValues();
                } else {
                    Operator_1 = Operator;
                }
            } else if (Value_1_set && !Value_2_set) {
                Value_2 = cs_removeCommas(document.cs_calculator_form.cs_display.value);
                Operator_2 = Operator;
                Value_2_set = true;
                cs_execute();
                aValue = cs_formatResult(aValue);
                cs_displayValue(aValue);
            } else if (Operator !== "=" || Operator_3 === "=") {
                cs_resetValues();
                Value_1 = cs_removeCommas(document.cs_calculator_form.cs_display.value);
                Value_1 = Value;
                Operator_1 = Operator;
                Value_1_set = true;
                cs_resetFlags();
                is_Operator = true;
            }
        }
    }
}

function cs_execute() {
    val_1 = parseFloat(Value_1);
    val_2 = parseFloat(Value_2);
    Operator_3 = Oper = Operator_1;
    Value_3 = Value_2;
    Value_3_set = true;
    ans = "";
    switch (Oper) {
        case "+":
            ans = val_1 + val_2;
            break;
        case "-":
            ans = val_1 - val_2;
            break;
        case "*":
            ans = val_1 * val_2;
            break;
        case "/":
            ans = val_2 === 0 ? "NaN" : val_1 / val_2;
            break;
        case "pow":
            ans = Math.pow(val_1, val_2);
            break;
    }
    Value = ans;
    if (ans === "NaN" || isNaN(ans)) {
        cs_resetValues();
        cs_resetFlags();
        aValue = ans;
    } else {
        Operator = Operator_2;
        aValue = parseFloat(ans);
        if (Operator_2 === "=") {
            cs_resetValues();
            cs_resetFlags();
            is_Executed = true;
            cs_clear_button.innerHTML = "AC";
        } else {
            cs_resetValues();
            Value_1 = ans;
            Operator_1 = Operator;
            Value_1_set = true;
            cs_resetFlags();
            is_Operator = true;
        }
    }
}

function cs_display_clear() {
    if (cs_clear_button.innerHTML === "AC" || document.cs_calculator_form.cs_display.value === " " || document.cs_calculator_form.cs_display.value === "NaN" || cs_clear_button.innerHTML === "CE" && is_Constant && !Value_1_set) {
        cs_resetFlags();
        cs_resetValues();
        cs_resetThrees();
        Value = "0";
        Operator_last = Operator = "";
        cs_displayValue(Value);
        cs_clear_button.innerHTML = "AC";
    } else if (cs_clear_button.innerHTML === "CE") {
        cs_clear_button.innerHTML = "AC";
        Value = 0;
        cs_displayValue(Value);
    }
}

function cs_memory_plus() {
    if (cs_preconditions()) {
        a = parseFloat(document.cs_calculator_form.cs_memory_val.value);
        b = parseFloat(Value);
        t = a + b;
        document.cs_calculator_form.cs_memory_val.value = t;
        cs_resetFlags();
        is_Executed = true;
    }
}

function cs_memory_minus() {
    if (cs_preconditions()) {
        a = parseFloat(document.cs_calculator_form.cs_memory_val.value);
        b = parseFloat(Value);
        t = a - b;
        document.cs_calculator_form.cs_memory_val.value = t;
        cs_resetFlags();
        is_Executed = true;
    }
}

function cs_memory_recall() {
    Value = document.cs_calculator_form.cs_memory_val.value;
    cs_displayValue(cs_formatResult(Value));
    cs_resetFlags();
    is_Constant = true;
}

function cs_memory_clear() {
    document.cs_calculator_form.cs_memory_val.value = 0;
}

function cs_func(c) {
    if (cs_preconditions() && (document.cs_calculator_form.cs_display.value !== " " || c === "pi")) {
        func_last = c;
        val = cs_removeCommas(Value);
        switch (c) {
            case "squareroot":
                Value = Math.sqrt(val);
                break;
            case "pi":
                Value = Math.PI;
                break;
            case "r0":
                val = parseFloat(cs_removeCommas(document.cs_calculator_form.cs_display.value));
                Value = val.toFixed(0);
                break;
            case "r2":
                val = parseFloat(cs_removeCommas(document.cs_calculator_form.cs_display.value));
                Value = val.toFixed(2);
                break;
            case "percent":
                Value = (!Value_1_set || !["+", "-"].includes(Operator_1)) ? val / 100 : val_1 * (val / 100);
                break;
            case "power2":
                Value = Math.pow(val, 2);
                break;
            case "power3":
                Value = Math.pow(val, 3);
                break;
            case "log":
                Value = Math.log(val) / Math.LN10;
                break;
            case "ln":
                Value = Math.log(val);
                break;
            case "exp":
                Value = Math.exp(val);
                break;
            case "inverse":
                Value = 1 / val;
                break;
            case "negative":
                Value = val * -1;
                break;
        }
        aValue = cs_formatResult(Value);
        cs_displayValue(aValue);
        cs_resetFlags();
        is_Constant = true;
    }
}

function cs_formatResult(c) {
    c = Math.round(c * 100000) / 100000;
    if (c.toString().indexOf(".") === -1 && c.toString().length > 12) {
        c = parseFloat(c).toExponential(5);
    } else if (c.toString().indexOf(".") !== -1 && c.toString().length > 12) {
        c = c.toString().substring(0, 12);
    }
    return c;
}

function cs_resetFlags() {
    is_Number = is_Decimal = is_Operator = is_Constant = is_Executed = false;
}

function cs_resetValues() {
    Value_1_set = Value_2_set = false;
    Value_1 = Value_2 = 0;
    Operator_1 = Operator_2 = 0;
}

function cs_resetThrees() {
    Value_3_set = false;
    Value_3 = 0;
    Operator_3 = 0;
}
