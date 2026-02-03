
import useGetUserProfile from '../../../hooks/useGetUserProfile';
import AITrainingCenter from '../AITrainingCenter'
import UploadedDocuments from '../UploadedDocuments'
import PromptModifySection from './PromptModifySection'

const AITrainingPage = () => {
    const { userProfileData } = useGetUserProfile();
    console.log("0000000000000000000000000000000",userProfileData?.role);
    const permission= userProfileData?.role==="owner" || userProfileData?.role==="president"
    return (
        <div className='flex flex-col gap-15 '>
            <section className=''>
                <AITrainingCenter></AITrainingCenter>
            </section>
            {/* ================================ Prompt Modification =========================== */}
            <section>
                {
                    permission && <PromptModifySection></PromptModifySection>
                }
            </section>
            {/*=============================== Uploaded Document 2nd part ===============================*/}
            <section>
                <UploadedDocuments></UploadedDocuments>
            </section>

        </div>
    )
}

export default AITrainingPage