import { defineComponent } from "vue";
import { Button, message } from "ant-design-vue";

export default defineComponent({
    template: require("./index.html"),
    components: {
        Button
    },
    setup() {
        const onMessage = () => {
            message.success("info");
        };
        return {
            onMessage
        };
    }
});