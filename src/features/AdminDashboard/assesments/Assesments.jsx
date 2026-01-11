
import CreateNewAssesment from './CreateNewAssesment'
import GeneratedAssesmentsAndHistories from './GeneratedAssesmentsAndHistories'


const Assesments = () => {
    return (
        <div>
            <section>
                <CreateNewAssesment></CreateNewAssesment>
            </section>
            <section>
                <GeneratedAssesmentsAndHistories></GeneratedAssesmentsAndHistories>
            </section>
        </div>
    )
}

export default Assesments