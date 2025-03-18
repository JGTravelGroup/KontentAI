import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import React, { useEffect, useState } from "react";
import { useResizeDetector } from "react-resize-detector";
import Head from "next/head";
import { ExportCustomElement } from "../../components/custom-elements/export";
import { ExportToursCustomElement } from "../../components/custom-elements/export-tours";

import { ExportCustomElement_SJ } from "../../components/custom-elements/export-SJ";

interface IProps {
    elementComponent: string
}

const CustomElementTest: NextPage<IProps> = ({ elementComponent }) => {
    const [error, setError] = useState("")
    const [element, setElement] = useState<CustomElement.Element>()
    const [context, setContext] = useState<CustomElement.Context>()
    const [value, setValue] = useState<string>()

    if (process.browser) {
        document.body.style.background = "none transparent"
    }

    const { height, ref } = useResizeDetector();

    useEffect(() => {
        try {
            CustomElement?.init((element, context) => {
                setElement(element)
                setContext(context)
                setValue(element.value as string)
            })
        } catch (error: any) {
            setError(error.toString())
        }
    }, [])

    useEffect(() => {
        if (CustomElement && height as number > 0) {
            CustomElement.setHeight(Math.ceil(height as number) + 15)
        }
    }, [height])

    const handleSave = (newValue: string) => {
        setValue(newValue)
        CustomElement.setValue(newValue)
    }

    let customElement = <div><p>There was an issue loading the Custom Element</p></div>
    if (element && context) {
        switch (elementComponent) {
            case "export":
                customElement = <ExportCustomElement element={element} context={context} handleSave={handleSave} value={value} />
                break;
            case "export-SJ":
                customElement = <ExportCustomElement_SJ element={element} context={context} handleSave={handleSave} value={value} />
                break;
            case "exportall":
                customElement = <ExportToursCustomElement element={element} context={context} handleSave={handleSave} value={value} />
                break;
            default:
                customElement = <div><p>Custom element not configured in code</p></div>
                break;
        }
    } else {
        customElement = <div><p>The <code>Element</code> and/or <code>Context</code> is not loaded yet</p></div>
    }
    return (
        <>
            <Head>
                <script src="https://app.kontent.ai/js-api/custom-element/v1/custom-element.min.js"></script>
            </Head>
            <div>
                <div ref={ref}>
                    {customElement}
                </div>
            </div>
        </>)
}

export default CustomElementTest;

export const getStaticPaths: GetStaticPaths = async (params) => {
    return {
        paths: [
            '/ce/export',
            '/ce/exportall',
            '/ce/export-SJ'
        ],
        fallback: false
    }
}

export const getStaticProps: GetStaticProps<IProps, NodeJS.Dict<string>> = async context => {
    const { element }: any = context.params

    return {
        props: {
            elementComponent: element
        }
    }
}