
import AITrainingCenter from '../AITrainingCenter'
import UploadedDocuments from '../UploadedDocuments'
import PromptModifySection from './PromptModifySection'

const AITrainingPage = () => {
    return (
        <div className='flex flex-col gap-15 '>
            <section className=''>
                <AITrainingCenter></AITrainingCenter>
            </section>
            {/* ================================ Prompt Modification =========================== */}
            <PromptModifySection />
            {/*=============================== Uploaded Document 2nd part ===============================*/}
            <section>
                <UploadedDocuments></UploadedDocuments>
            </section>

        </div>
    )
}

export default AITrainingPage