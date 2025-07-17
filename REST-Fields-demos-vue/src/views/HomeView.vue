<script setup lang="ts">
import 'survey-core/survey-core.css';
import { Model as SurveyjsModal } from 'survey-core';
import { SurveyComponent } from 'survey-vue3-ui';
import { JSONEditor } from '@json-editor/json-editor';
import { extendedVuetifyRenderers  } from '@jsonforms/vue-vuetify'
import { JsonForms } from '@jsonforms/vue'
import hljs from 'highlight.js/lib/core';
import json from 'highlight.js/lib/languages/json';
import 'highlight.js/styles/github.css'; // or any theme you prefer
import CopyButtonPlugin from 'highlightjs-copy'
import 'highlightjs-copy/dist/highlightjs-copy.min.css'

hljs.registerLanguage('json', json);
hljs.addPlugin(
  new CopyButtonPlugin({
    autohide: false, // Always show the copy button
  })
);
import OptionsCard from "../components/OptionCard.vue";
import SurveyJsLogo from "@/assets/icons/surveyjs-logo.svg";
import FormKitLogo from "@/assets/icons/formkit-logo.svg";
import JsonFormsLogo from "@/assets/icons/jsonforms.svg";
import { ref, shallowRef, onMounted, watch, markRaw } from "vue";
import formkitDefaultSchema from "@/assets/default-schema/formkit.json"
import jsonEditorDefaultSchema from "@/assets/default-schema/json-editor.json"
import jsonFormsDefaultSchema from "@/assets/default-schema/json-forms.json"
import jsonFormsDefaultUiSchema from "@/assets/default-schema/json-forms-ui.json"
import surveyjsDefaultSchema from "@/assets/default-schema/surveyjs.json"

let selectedRenderer = ref<"" | "surveyjs" | "json-editor" | "formkit" | "json-forms">("");

onMounted(() => {
    let urlParams = new URLSearchParams(window.location.search);
    selectedRenderer.value = urlParams.get('renderer') ?? '';
})

const code = ref(JSON.stringify(surveyjsDefaultSchema, null, 4));
const SubmitObject = ref<any>(null);

const surveyModel = shallowRef<SurveyjsModal | null>(null);
const formkitSchema = ref<any>(null)
const formkitData = ref<any>({})
const jsonFormsRenderers = markRaw(extendedVuetifyRenderers);
const jsonEditorRef = ref<HTMLElement | null>(null);
const jsonFormsSchema = ref<any>(null);

watch(selectedRenderer, () => {
    if (selectedRenderer.value === "surveyjs") {
        code.value = JSON.stringify(surveyjsDefaultSchema, null, 4)
    }
    if (selectedRenderer.value === "json-editor") {
        code.value = JSON.stringify(jsonEditorDefaultSchema, null, 4)
    }
    if (selectedRenderer.value === "formkit") {
        code.value = JSON.stringify(formkitDefaultSchema, null, 4)
    }
    if (selectedRenderer.value === "json-forms") {
        code.value = JSON.stringify(jsonFormsDefaultSchema, null, 4);
    }
});

function share() {
    
}

function loadForm(form: string) {
    let schema = JSON.parse(code.value);
    if (form === 'surveyjs') {
        surveyModel.value = new SurveyjsModal(schema);
        surveyModel.value.showCompleteButton = false;
    }
    if (form === 'formkit') {
        formkitSchema.value = schema;
    }
    if (form === 'json-editor') {
        new JSONEditor(jsonEditorRef.value, {
            schema: schema,
            disable_collapse: true,
            theme: 'bootstrap5',
            disable_edit_json: true,
            disable_properties: true,
            no_additional_properties: true,
            disable_array_delete_all_rows: true,
            disable_array_delete_last_row: true,
            prompt_before_delete: false,
            show_errors: 'always'
        });
    }
    if (form === 'json-forms') {
        jsonFormsSchema.value = schema; 
    }
}

const MONACO_EDITOR_OPTIONS = {
    automaticLayout: true,
    formatOnType: true,
    formatOnPaste: true,
    language: "json",
    stickyScroll: {
        enabled: false
    }
}

const editor = shallowRef()
const handleMount = (editor: any, monaco: any) => {
    editor.value = editor;
    monaco.editor.setModelLanguage(editor.getModel(), "json");
};


</script>

<template>
    <details name="step" open>
        
        <summary>
            1. Choose form renderer
        </summary>

        <div class="flex gap-8 overflow-auto">

            <div class="text-center">
                <OptionsCard :active="selectedRenderer === 'surveyjs'" @click="selectedRenderer = 'surveyjs'">
                    <SurveyJsLogo class="h-20 w-20"></SurveyJsLogo>
                </OptionsCard>
                SurveyJS
            </div>

            <div class="text-center">
                <OptionsCard :active="selectedRenderer === 'json-editor'" @click="selectedRenderer = 'json-editor'">
                    <img class="h-20 w-20 max-w-none" src="@/assets/icons/json-editor-logo.png" alt="json-editor">
                </OptionsCard>
                JSON Editor
            </div>

            <div class="text-center">
                <OptionsCard :active="selectedRenderer === 'formkit'" @click="selectedRenderer = 'formkit'">
                    <FormKitLogo class="h-20 w-20"></FormKitLogo>
                </OptionsCard>
                FormKit
            </div>

            <div class="text-center">
                <OptionsCard :active="selectedRenderer === 'json-forms'" @click="selectedRenderer = 'json-forms'">
                    <JsonFormsLogo class="h-20 w-20"></JsonFormsLogo>
                </OptionsCard>
                JSONForms
            </div>
        </div>
        
    </details>
    
    <details name="step">
        <summary>
            2. Renderer schema
        </summary>
        <div>
            <vue-monaco-editor class="border border-[#8c8c8c]" 
                v-model:value="code" 
                :options="MONACO_EDITOR_OPTIONS" 
                height="400px"
                @mount="handleMount" 
            />

            <button class="jf-btn jf-btn-primary" @click="share()">Share</button>
        </div>
    </details>

    <details name="step">
        <summary>
            3. Load data (optional)
        </summary>
        <div>

        </div>
    </details>

    <details name="step">
        <summary>
            4. Fill form
        </summary>

        <div>
            <button class="jf-btn jf-btn-primary" @click="loadForm(selectedRenderer)">Load form</button>


            <div v-if="selectedRenderer === 'surveyjs' && surveyModel">
                <SurveyComponent :model="surveyModel" />

                <button @click="() => {
                    // will also trigger UI error messages
                    if (surveyModel!.validate()) {
                        SubmitObject = surveyModel!.data;
                    }
                }" class="jf-btn jf-btn-primary">Save</button>
            </div>

            <div v-if="selectedRenderer === 'formkit' && formkitSchema">
                <FormKit
                    type="form"
                    v-model="formkitData"
                    :actions="false"
                    @submit="() => {
                        SubmitObject = formkitData;
                    }"
                >
                    <FormKitSchema :schema="formkitSchema" />
                    <FormKit type="submit" label="Save" />
                </FormKit>
            </div>

            <div v-if="selectedRenderer === 'json-editor'">
                <div ref="jsonEditorRef"></div>
            </div>

            <div v-if="selectedRenderer === 'json-forms'">
                <JsonForms
                    :schema="jsonFormsSchema"
                    :renderers="jsonFormsRenderers"
                    @change="({ data }) => {
                        if (data) {
                            SubmitObject = data;
                        }
                    }"
                />
            </div>
        </div>
    </details>

    <details name="step">
        <summary>
            5. Output
        </summary>

        <div>
            <pre class="bg-[#f6f8fa] p-[16px] rounded text-sm overflow-auto" v-html="hljs.highlight(JSON.stringify(SubmitObject, null, 4), { language: 'json'}).value"></pre>
        </div>
    </details>
</template>
