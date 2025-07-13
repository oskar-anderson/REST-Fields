<script setup lang="ts">
import 'survey-core/survey-core.css';
import 'formiojs/dist/formio.full.min.css';
import { Model as SurveyjsModal } from 'survey-core';
import { SurveyComponent } from 'survey-vue3-ui';
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

import { Formio, FormBuilder } from 'formiojs';

import OptionsCard from "../components/OptionCard.vue";
import SurveyJsLogo from "@/assets/icons/surveyjs-logo.svg";
import FormIoLogo from "@/assets/icons/formio-logo.svg";
import FormKitLogo from "@/assets/icons/formkit-logo.svg";
import { ref, shallowRef, onMounted, watch } from "vue";
import formioDefaultSchema from "@/assets/default-schema/formio.json"
import formkitDefaultSchema from "@/assets/default-schema/formkit.json"
import jsonEditorDefaultSchema from "@/assets/default-schema/json-editor.json"
import surveyjsDefaultSchema from "@/assets/default-schema/surveyjs.json"

let selectedRenderer = ref<"" | "formio" | "surveyjs" | "json-editor" | "formkit">("");

onMounted(() => {
    let urlParams = new URLSearchParams(window.location.search);
    selectedRenderer.value = urlParams.get('renderer') ?? '';
})

const code = ref(JSON.stringify(formioDefaultSchema, null, 4));
const SubmitObject = ref<any>(null);

const surveyModel = shallowRef<SurveyjsModal | null>(null);
const formioInstance = ref<FormBuilder | null>(null);
const formkitSchema = ref<any>(null)
const formkitData = ref<any>({})

watch(selectedRenderer, () => {
    if (selectedRenderer.value === "formio") {
        code.value = JSON.stringify(formioDefaultSchema, null, 4)
    }
    if (selectedRenderer.value === "surveyjs") {
        code.value = JSON.stringify(surveyjsDefaultSchema, null, 4)
    }
    if (selectedRenderer.value === "json-editor") {
        code.value = JSON.stringify(jsonEditorDefaultSchema, null, 4)
    }
    if (selectedRenderer.value === "formkit") {
        code.value = JSON.stringify(formkitDefaultSchema, null, 4)
    }
});

function share() {
    
}

function loadForm(form: string) {
    let schema = JSON.parse(code.value);
    if (form === 'surveyjs') {
        surveyModel.value = new SurveyjsModal(schema);

        /*
        surveyModel.value.onComplete.add((sender) => {
            SubmitObject.value = sender.data;
        });
        */
    }
    if (form === 'formio') {
        if (formioInstance.value) {
            formioInstance.value.destroy();
        }
        Formio.createForm(document.querySelector('#formio-container')!, schema, {});
    }
    if (form === 'formkit') {
        formkitSchema.value = schema;
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
                <OptionsCard :active="selectedRenderer === 'formio'" @click="selectedRenderer = 'formio'">
                    <FormIoLogo class="h-20 w-20"></FormIoLogo>
                </OptionsCard>
                Form IO
            </div>

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
            <div v-if="selectedRenderer === 'formio'">
                <div id="formio-container"></div>
                <button @click="() => {
                    
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
